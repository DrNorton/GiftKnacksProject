using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GiftKnackNotificationAgent.Models;

using GiftKnackProject.NotificationTypes;
using GiftKnackProject.NotificationTypes.ProcessedNotifications;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Microsoft.ServiceBus.Messaging;
using Newtonsoft.Json;

namespace GiftKnackNotificationAgent.Services
{
    public class MessageFromMqProcessor : IMessageFromMqProcessor
    {
   
        private  DocumentClient _client;
        private readonly IHandlersDispatcher _handlersDispatcher;

        private const string DatabaseId = "notificationslenta";

        public MessageFromMqProcessor(DocumentClient client,IHandlersDispatcher handlersDispatcher)
        {
            _client = client;
            _handlersDispatcher = handlersDispatcher;
        }

        public async Task<IEnumerable<Notification>> ProcessMessage(BrokeredMessage message)
        {
            var type = message.Properties["Type"].ToString().ToLower();
            var body=message.GetBody<string>();
            IEnumerable<Notification> notifications=null;
            
            switch (type)
            {
                case "addcomment":
                    notifications = await _handlersDispatcher.FindHandlerAndExecute<AddCommentQueueNotification>(body);
                     
                    break;

                case "join":
                    notifications = await _handlersDispatcher.FindHandlerAndExecute<JoinQueueNotification>(body);
                    break;


                case "addreference":
                    notifications = await _handlersDispatcher.FindHandlerAndExecute<AddReferenceQueueNotification>(body);
                    break;

                case "closejoineditem":
                    notifications = await _handlersDispatcher.FindHandlerAndExecute<CloseItemQueueNotification>(body);
                    break;

                case "totalclosechange":
                    notifications = await _handlersDispatcher.FindHandlerAndExecute<TotalClosedQueueNotification>(body);
                    break;


            }

          
            var database = await RetrieveOrCreateDatabaseAsync(DatabaseId);
            foreach (var notification in notifications)
            {
                var collection = await RetrieveOrCreateCollectionAsync(database.SelfLink, notification.Info.OwnerId.ToString());
                await _client.CreateDocumentAsync(collection.DocumentsLink, notification);
            }
            return notifications;
        }


        private  async Task<Database> RetrieveOrCreateDatabaseAsync(string id)
        {
            // Try to retrieve the database (Microsoft.Azure.Documents.Database) whose Id is equal to databaseId            
            var database = _client.CreateDatabaseQuery().Where(db => db.Id == DatabaseId).AsEnumerable().FirstOrDefault();

            // If the previous call didn't return a Database, it is necessary to create it
            if (database == null)
            {
                database = await _client.CreateDatabaseAsync(new Database { Id = DatabaseId });
                Console.WriteLine("Created Database: id - {0} and selfLink - {1}", database.Id, database.SelfLink);
            }

            return database;
        }

        private  async Task<DocumentCollection> RetrieveOrCreateCollectionAsync(string databaseSelfLink, string id)
        {
            // Try to retrieve the collection (Microsoft.Azure.Documents.DocumentCollection) whose Id is equal to collectionId
            var collection = _client.CreateDocumentCollectionQuery(databaseSelfLink).Where(c => c.Id == id).ToArray().FirstOrDefault();

            // If the previous call didn't return a Collection, it is necessary to create it
            if (collection == null)
            {
                collection = await _client.CreateDocumentCollectionAsync(databaseSelfLink, new DocumentCollection { Id = id });
            }

            return collection;
        }
    }
}

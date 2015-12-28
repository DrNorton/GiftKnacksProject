using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GiftKnackNotificationAgent.Models.Infos;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Microsoft.ServiceBus.Messaging;

namespace GiftKnackNotificationAgent.Services
{
    public class MessageFromMqProcessor : IMessageFromMqProcessor
    {
        private  DocumentClient _client;
        private INotificationFabric _notificationFabric;
        private const string DatabaseId = "notificationslenta";

        public MessageFromMqProcessor(INotificationFabric notificationFabric, DocumentClient client)
        {
            _notificationFabric = notificationFabric;
            _client = client;
        }

        public async Task ProcessMessage(BrokeredMessage message)
        {
            var creatorId = message.Properties["CreatorId"];
            var type = message.Properties["Type"].ToString().ToLower();
            var notification= await _notificationFabric.CreateNotification(type, message.Properties);
            var database = await RetrieveOrCreateDatabaseAsync(DatabaseId);
            var collection = await RetrieveOrCreateCollectionAsync(database.SelfLink, creatorId.ToString());
            await _client.CreateDocumentAsync(collection.DocumentsLink, new AddCommentInfo());
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

﻿using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using GiftKnackNotificationAgent.Services;
using Microsoft.Azure.Documents.Client;

namespace GiftKnackNotificationAgent.Installers
{
    public class ServiceInstaller:IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            var endpointUrl = ConfigurationManager.AppSettings["EndPointUrl"];
            var authorizationKey = ConfigurationManager.AppSettings["AuthorizationKey"];

            container.Register(
                Component.For<DocumentClient>()
                    .DependsOn(Dependency.OnValue("serviceEndpoint", new Uri(endpointUrl)),
                        Dependency.OnValue("authKeyOrResourceToken", authorizationKey))
                    .LifestyleTransient());

            container.Register(Component.For<Functions>().LifestyleTransient());
            container.Register(Component.For<INotificationFabric>().ImplementedBy<NotificationFabric>().LifestyleTransient());
            container.Register(
                Component.For<IMessageFromMqProcessor>()
                    .ImplementedBy<MessageFromMqProcessor>()
                    .LifestyleTransient());

        }
    }
}

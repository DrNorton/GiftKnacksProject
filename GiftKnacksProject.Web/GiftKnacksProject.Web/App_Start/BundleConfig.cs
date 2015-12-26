using System.Web;
using System.Web.Optimization;

namespace GiftKnacksProject.Web
{
		public class BundleConfig
		{
				// For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
				public static void RegisterBundles(BundleCollection bundles)
				{
						bundles.Add(new ScriptBundle("~/bundles/vendors").Include(
                                                "~/Scripts/modernizr-*",
                                                "~/Scripts/jquery-{version}.js",
                                                "~/Scripts/jquery.validate*",
                                                "~/Scripts/jquery.signalR-2.2.0.min.js",
                                                "~/Scripts/angular.js",
											    "~/Scripts/angular-route.js",
											    "~/Scripts/angular-ui/ui-bootstrap-tpls-0.12.0.min.js",
												"~/Scripts/vendors/loading-bar.js",
												"~/Scripts/vendors/common.js",
												"~/Scripts/vendors/angular-local-storage.js",
												"~/Scripts/vendors/inputmask/jquery.inputmask.js",
												"~/Scripts/vendors/inputmask/jquery.inputmask.date.extensions.js",
												"~/Scripts/vendors/infinite-scroll.min.js",
                                                "~/Scripts/vendors/ng-img-crop.js",
                                                "~/Scripts/vendors/angularytics.js",
                                                "~/Scripts/bootstrap.js",
											    "~/Scripts/respond.js",
                                                "~/Scripts/app/app.js",
											    "~/Scripts/app/controllers.js",
											    "~/Scripts/app/directives.js",
											    "~/Scripts/app/services.js"));

						bundles.Add(new StyleBundle("~/Content/css").Include(
											"~/Content/bootstrap-theme.css",
                                            "~/Content/font-awesome.min.css",
											"~/Content/loading-bar.css",
                                            "~/Content/ng-img-crop.css",
											"~/Content/site.css"));

						// Set EnableOptimizations to false for debugging. For more information,
                        // visit http://go.microsoft.com/fwlink/?LinkId=301862
#if DEBUG
                        BundleTable.EnableOptimizations = false;
#else
            BundleTable.EnableOptimizations = true;
#endif
				}
		}
}

using System.Web;
using System.Web.Optimization;

namespace GiftKnacksProject.Web
{
		public class BundleConfig
		{
				// For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
				public static void RegisterBundles(BundleCollection bundles)
				{
						bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
												"~/Scripts/jquery-{version}.js"));

						bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
												"~/Scripts/jquery.validate*"));

						bundles.Add(new ScriptBundle("~/bundles/vendors").Include(
												"~/Scripts/vendors/loading-bar.js",
												"~/Scripts/vendors/common.js",
												"~/Scripts/vendors/fileinput.js",
												"~/Scripts/vendors/angular-local-storage.js",
												"~/Scripts/vendors/inputmask/jquery.inputmask.js",
												"~/Scripts/vendors/inputmask/jquery.inputmask.date.extensions.js",
												"~/Scripts/vendors/infinite-scroll.min.js"));

						// Use the development version of Modernizr to develop with and learn from. Then, when you're
						// ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
						bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
												"~/Scripts/modernizr-*"));

						bundles.Add(new ScriptBundle("~/bundles/angular").Include(
											"~/Scripts/angular.js",
											"~/Scripts/angular-route.js",
											"~/Scripts/angular-ui/ui-bootstrap-tpls-0.12.0.min.js"));

						bundles.Add(new ScriptBundle("~/bundles/app").Include(
											"~/Scripts/app/app.js",
											"~/Scripts/app/controllers.js",
											"~/Scripts/app/directives.js",
											"~/Scripts/app/services.js"));  

						bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
											"~/Scripts/bootstrap.js",
											"~/Scripts/respond.js"));

						bundles.Add(new StyleBundle("~/Content/css").Include(
											"~/Content/bootstrap.css",
											"~/Content/loading-bar.css",
											"~/Content/site.css"));

						// Set EnableOptimizations to false for debugging. For more information,
						// visit http://go.microsoft.com/fwlink/?LinkId=301862
						BundleTable.EnableOptimizations = false;
				}
		}
}

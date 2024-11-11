using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace WebApiCore {
    public class WebApiApplication : System.Web.HttpApplication {
        
        async Task<string> GetData() {
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri("http://localhost/WebApiCore/api/values");
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            string data = string.Empty;
            HttpResponseMessage response = await client.GetAsync("http://localhost/WebApiCore/api/values");
            if (response.IsSuccessStatusCode) {
                data = await response.Content.ReadAsAsync<string>();
            }
            return data;
        }

        protected void Application_Start() {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            
            // Initialize log4net.
            log4net.Config.XmlConfigurator.Configure();

        }

        protected void Application_PostAuthorizeRequest() {
            HttpContext.Current.SetSessionStateBehavior(System.Web.SessionState.SessionStateBehavior.Required);
        }

        protected void Application_BeginRequest(object sender, EventArgs e) {

        }
    }
}

using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Cors;
using System.Web.Http.Cors;

namespace WebApiExt.Politicas {

    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false)]
    public class PoliticaCorsBan : Attribute, ICorsPolicyProvider {
        private CorsPolicy policy;

        public PoliticaCorsBan() {
            policy = new CorsPolicy { };

            // Servidor frontend angular
            //policy.Origins.Add("http://172.16.20.146:4500");
            //policy.Origins.Add("http://172.16.20.103:4400");
            //policy.Origins.Add("http://192.168.0.6:8084");
            policy.AllowAnyOrigin = true;
            policy.Headers.Add("x-auth-token");
            policy.Headers.Add("X-Requested-With"); 
            policy.Headers.Add("Content-Type");
            policy.Headers.Add("Accept");
            policy.Headers.Add("Cache-Control");

            policy.Methods.Add("GET");
            policy.Methods.Add("HEAD");
            policy.Methods.Add("POST");
            policy.Methods.Add("PUT");
            policy.Methods.Add("DELETE");
            policy.Methods.Add("TRACE");
            policy.Methods.Add("OPTIONS");

            policy.SupportsCredentials = true;
        }

        public Task<CorsPolicy> GetCorsPolicyAsync(HttpRequestMessage request, CancellationToken cancellationToken) {
            return Task.FromResult(policy);
        }
    }
}
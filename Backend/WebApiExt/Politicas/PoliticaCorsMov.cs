using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Cors;
using System.Web.Http.Cors;

namespace WebApiExt.Politicas {

    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false)]
    public class PoliticaCorsMov : Attribute, ICorsPolicyProvider {
        private CorsPolicy policy;

        public PoliticaCorsMov() {
            policy = new CorsPolicy { };

            // Origin moviles
            //policy.Origins.Add("file://");
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
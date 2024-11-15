import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { InicioComponent } from '../../sobre/inicio/componentes/inicio.component';

/**
 * Clase que se encarga de verificar si el usuario ha realizado login en la aplicacion.
 * si no ha realizado un login carga la pagina de login.
 */
@Injectable()
export class VerificaAutorizacionService implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // contien los datos minimos con los que se ejecuta una transacción en el core.
        if (sessionStorage.getItem('jwt') && sessionStorage.getItem('jwt') !== '') {
            // logged in so return true
            return true;
        }
        if (route.component === undefined || route.component['name'] !== 'InicioComponent') {
          // si no esta logeado, muestra la pagina de recargar
         // this.router.navigate(['/reload'], { queryParams: { returnUrl: state.url}, skipLocationChange: true});
        }
        sessionStorage.clear();
        return false;
    }
}

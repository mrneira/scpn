import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { SesionUsuarioRoutingModule } from './sesionUsuario.routing';
import { SesionUsuarioComponent } from './componentes/sesionUsuario.component';

@NgModule({
  imports: [SharedModule, SesionUsuarioRoutingModule ],
  declarations: [SesionUsuarioComponent]
})
export class SesionUsuarioModule { }

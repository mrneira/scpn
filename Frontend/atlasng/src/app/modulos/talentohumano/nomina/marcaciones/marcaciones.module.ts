import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { MarcacionesRoutingModule } from './marcaciones.routing';
import { MarcacionesComponent } from './componentes/marcaciones.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';

@NgModule({
  imports: [SharedModule, MarcacionesRoutingModule,CabeceraModule,DetalleModule],
  declarations: [ MarcacionesComponent]
})
export class MarcacionesModule { }

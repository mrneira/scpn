import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { MapaFuncionariosRoutingModule } from './mapafuncionarios.routing';

import { MapaFuncionariosComponent } from './componentes/mapafuncionarios.component';
import { GMapModule } from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, MapaFuncionariosRoutingModule, GMapModule],
  declarations: [MapaFuncionariosComponent],
  exports: [MapaFuncionariosComponent]
})
export class MapaFuncionariosModule { }

import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PartidaIngresoRoutingModule } from './partidaIngreso.routing';

import { PartidaIngresoComponent } from './componentes/partidaIngreso.component';
import { LovClasificadorModule } from '../../lov/clasificador/lov.clasificador.module';
import { TreeTableModule} from 'primeng/primeng';
import { SelectButtonModule} from 'primeng/primeng';
import { AccionesArbolModule } from '../../../../util/componentes/accionesarbol/accionesArbol.module';

@NgModule({
  imports: [SharedModule, PartidaIngresoRoutingModule, AccionesArbolModule, TreeTableModule, SelectButtonModule, LovClasificadorModule ],
  declarations: [PartidaIngresoComponent]
})
export class PartidaIngresoModule { }

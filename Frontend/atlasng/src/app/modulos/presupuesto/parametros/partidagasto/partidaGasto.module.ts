import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PartidaGastoRoutingModule } from './partidaGasto.routing';

import { PartidaGastoComponent } from './componentes/partidaGasto.component';
import { LovClasificadorModule } from '../../lov/clasificador/lov.clasificador.module';
import { TreeTableModule} from 'primeng/primeng';
import { SelectButtonModule} from 'primeng/primeng';
import { AccionesArbolModule } from '../../../../util/componentes/accionesarbol/accionesArbol.module';

@NgModule({
  imports: [SharedModule, PartidaGastoRoutingModule, AccionesArbolModule, TreeTableModule, SelectButtonModule, LovClasificadorModule ],
  declarations: [PartidaGastoComponent]
})
export class PartidaGastoModule { }

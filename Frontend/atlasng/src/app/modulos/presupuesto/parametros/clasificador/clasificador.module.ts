import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ClasificadorRoutingModule } from './clasificador.routing';

import { ClasificadorComponent } from './componentes/clasificador.component';
import { AccionesArbolModule } from '../../../../util/componentes/accionesarbol/accionesArbol.module';

import { TreeTableModule} from 'primeng/primeng';
import { SelectButtonModule} from 'primeng/primeng';


@NgModule({
  imports: [SharedModule, ClasificadorRoutingModule,  AccionesArbolModule, TreeTableModule, SelectButtonModule],
  declarations: [ClasificadorComponent]
})
export class ClasificadorModule { }

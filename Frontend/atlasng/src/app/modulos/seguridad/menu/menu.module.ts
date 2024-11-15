import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { MenuRoutingModule } from './menu.routing';

import { MenuComponent } from './componentes/menu.component';
import { LovTransaccionesModule } from '../../generales/lov/transacciones/lov.transacciones.module';
import { AccionesArbolModule } from '../../../util/componentes/accionesarbol/accionesArbol.module';

import { TreeTableModule} from 'primeng/primeng';
import { SelectButtonModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, MenuRoutingModule, AccionesArbolModule, TreeTableModule, SelectButtonModule, LovTransaccionesModule ],
  declarations: [MenuComponent]
})
export class MenuModule { }

import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ModulosRoutingModule } from './catalogosCuentas.routing';

import { CatalogosCuentasComponent } from './componentes/catalogosCuentas.component';
import { LovCuentasContablesModule } from '../../lov/cuentascontables/lov.cuentasContables.module';
import { AccionesArbolModule } from '../../../../util/componentes/accionesarbol/accionesArbol.module';

import { TreeTableModule} from 'primeng/primeng';
import { SelectButtonModule} from 'primeng/primeng';


@NgModule({
  imports: [SharedModule, ModulosRoutingModule,  AccionesArbolModule, TreeTableModule, SelectButtonModule, LovCuentasContablesModule ],
  declarations: [CatalogosCuentasComponent]
})
export class CatalogosCuentasModule { }

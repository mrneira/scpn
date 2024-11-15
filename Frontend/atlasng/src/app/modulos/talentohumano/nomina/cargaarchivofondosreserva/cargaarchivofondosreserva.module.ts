import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CargaArchivosFRRoutingModule } from './cargaarchivofondosreserva.routing';
import { CargaArchivosFRComponent } from './componentes/cargaarchivofondosreserva.component';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';
import { SpinnerModule } from 'primeng/primeng';
import{ParametroAnualModule} from '../../lov/parametroanual/lov.parametroanual.module';

@NgModule({
  imports: [SharedModule, CargaArchivosFRRoutingModule, LovCuentasContablesModule,ParametroAnualModule, SpinnerModule],
  declarations: [CargaArchivosFRComponent]
})
export class CargaArchivosFRModule { }

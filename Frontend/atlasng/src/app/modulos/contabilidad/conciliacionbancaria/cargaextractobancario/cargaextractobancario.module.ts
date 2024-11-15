import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CargaextractobancarioRoutingModule } from './cargaextractobancario.routing';
import { CargaextractobancarioComponent } from './componentes/cargaextractobancario.component';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';
import { ResultadoCargaModule } from './submodulos/resultadocarga/resultadocarga.module';

@NgModule({
  imports: [SharedModule, CargaextractobancarioRoutingModule, ResultadoCargaModule, LovCuentasContablesModule],
  declarations: [CargaextractobancarioComponent]
})
export class CargaextractobancarioModule { }

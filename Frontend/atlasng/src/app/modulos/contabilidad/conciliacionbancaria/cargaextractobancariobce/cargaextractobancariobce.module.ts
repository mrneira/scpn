import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CargaExtractoBancarioBceRoutingModule } from './cargaextractobancariobce.routing';
import { CargaExtractoBancarioBceComponent } from './componentes/cargaextractobancariobce.component';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';
import { ResultadoCargaModule } from './submodulos/resultadocarga/resultadocarga.module';

@NgModule({
  imports: [SharedModule, CargaExtractoBancarioBceRoutingModule, ResultadoCargaModule, LovCuentasContablesModule],
  declarations: [CargaExtractoBancarioBceComponent]
})
export class CargaExtractoBancarioBceModule { }

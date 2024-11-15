import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { CargaMasivaFPRoutingModule } from './cargamasivafp.routing';
import { CargaMasivaFPComponent } from './componentes/cargamasivafp.component';
import { LovCuentasContablesModule } from '../../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';
import { ResultadoCargaModule } from './submodulos/resultadocarga/resultadoCarga.module';

@NgModule({
  imports: [SharedModule, CargaMasivaFPRoutingModule, ResultadoCargaModule, LovCuentasContablesModule],
  declarations: [CargaMasivaFPComponent]
})
export class CargaMasivaFPModule { }

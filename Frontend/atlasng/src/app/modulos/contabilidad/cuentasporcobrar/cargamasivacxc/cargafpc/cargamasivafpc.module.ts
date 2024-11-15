import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { CargaMasivaFPCRoutingModule } from './cargamasivafpc.routing';
import { CargaMasivaFPCComponent } from './componentes/cargamasivafpc.component';
import { LovCuentasContablesModule } from '../../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';
import { ResultadoCargaModule } from './submodulos/resultadocarga/resultadoCarga.module';

@NgModule({
  imports: [SharedModule, CargaMasivaFPCRoutingModule, ResultadoCargaModule, LovCuentasContablesModule],
  declarations: [CargaMasivaFPCComponent]
})
export class CargaMasivaFPCModule { }

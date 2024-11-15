import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { PoblarCedulaRoutingModule } from './poblarcedula.routing';
import { PoblarCedulaComponent } from './componentes/poblarcedula.component';
import { LovCuentasContablesModule } from '../../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';
import { ResultadoCargaModule } from './submodulos/resultadocarga/resultadoCarga.module';

@NgModule({
  imports: [SharedModule, PoblarCedulaRoutingModule, ResultadoCargaModule, LovCuentasContablesModule],
  declarations: [PoblarCedulaComponent]
})
export class PoblarCedulaModule { }

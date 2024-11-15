import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { CargaAporteAnterioresRoutingModule } from './cargaAporteAnteriores.routing';

import { CargaAporteAnterioresComponent } from './componentes/cargaAporteAnteriores.component';
import { JasperModule } from '../../../util/componentes/jasper/jasper.module';
//import { CargosModule } from './submodulos/prueba/_cargos.module';
import { ResultadoCargaModule } from './submodulos/resultadocarga/resultadoCarga.module';

@NgModule({
  imports: [SharedModule, CargaAporteAnterioresRoutingModule, ResultadoCargaModule,JasperModule],
  declarations: [CargaAporteAnterioresComponent]
})
export class CargaAporteAnterioresModule { }

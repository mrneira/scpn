import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { CargaAporteRoutingModule } from './cargaAporte.routing';

import { CargaAporteComponent } from './componentes/cargaAporte.component';
import { JasperModule } from '../../../util/componentes/jasper/jasper.module';
//import { CargosModule } from './submodulos/prueba/_cargos.module';
import { ResultadoCargaModule } from './submodulos/resultadocarga/resultadoCarga.module';

@NgModule({
  imports: [SharedModule, CargaAporteRoutingModule, ResultadoCargaModule,JasperModule],
  declarations: [CargaAporteComponent]
})
export class CargaAporteModule { }

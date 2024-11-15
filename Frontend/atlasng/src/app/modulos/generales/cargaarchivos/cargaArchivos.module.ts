import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { CargaArchivosRoutingModule } from './cargaArchivos.routing';
import { JasperModule } from '../../../util/componentes/jasper/jasper.module';
import { CargaArchivosComponent } from './componentes/cargaArchivos.component';
import { ResultadoCargaModule } from './submodulos/resultadocarga/resultadoCarga.module';

@NgModule({
  imports: [SharedModule, CargaArchivosRoutingModule, ResultadoCargaModule, JasperModule],
  declarations: [CargaArchivosComponent]
})
export class CargaArchivosModule { }

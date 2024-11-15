import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { CargaArchivosBIRoutingModule } from './cargaArchivosBI.routing';

import { CargaArchivosBIComponent } from './componentes/cargaArchivosBI.component';

import { ResultadoCargaModule } from './submodulos/resultadocarga/resultadoCarga.module';

@NgModule({
  imports: [SharedModule, CargaArchivosBIRoutingModule, ResultadoCargaModule],
  declarations: [CargaArchivosBIComponent]
})
export class CargaArchivosBIModule { }

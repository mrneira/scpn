import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ArchivosDescuentosRoutingModule } from './archivosDescuentos.routing';

import { ArchivosDescuentosComponent } from './componentes/archivosDescuentos.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, ArchivosDescuentosRoutingModule, JasperModule],
  declarations: [ArchivosDescuentosComponent]

})
export class ArchivosDescuentosModule { }

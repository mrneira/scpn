import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LogDocumentosElectronicosRoutingModule } from './logDocumentosElectronicos.routing';
import { LogDocumentosElectronicosComponent } from './componentes/logDocumentosElectronicos.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, LogDocumentosElectronicosRoutingModule, JasperModule],
  declarations: [LogDocumentosElectronicosComponent]
})
export class LogDocumentosElectronicosModule { }

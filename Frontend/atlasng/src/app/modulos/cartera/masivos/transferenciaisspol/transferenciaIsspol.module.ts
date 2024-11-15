import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { TransferenciaIsspolRoutingModule } from './transferenciaIsspol.routing';
import { TransferenciaIsspolComponent } from './componentes/transferenciaIsspol.component';
import { FileUploadModule } from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, TransferenciaIsspolRoutingModule, FileUploadModule],
  declarations: [TransferenciaIsspolComponent]
})
export class TransferenciaIsspolModule { }

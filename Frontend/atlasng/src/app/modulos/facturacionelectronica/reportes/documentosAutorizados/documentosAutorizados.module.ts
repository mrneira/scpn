import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DocumentosAutorizadosRoutingModule } from './documentosAutorizados.routing';
import { DocumentosAutorizadosComponent } from './componentes/documentosAutorizados.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovClientesModule } from '../../../contabilidad/lov/clientes/lov.clientes.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, DocumentosAutorizadosRoutingModule, JasperModule,LovClientesModule,TooltipModule],
  declarations: [DocumentosAutorizadosComponent]
})
export class DocumentosAutorizadosModule { }

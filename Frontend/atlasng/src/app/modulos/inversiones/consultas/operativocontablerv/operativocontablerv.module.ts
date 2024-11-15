import { NgModule } from '@angular/core';
import { OperativocontablervRoutingModule } from './operativocontablerv.routing';
import { OperativocontablervComponent } from './componentes/operativocontablerv.component';
import { SharedModule } from '../../../../util/shared/shared.module';
import { JasperModule } from 'app/util/componentes/jasper/jasper.module';


@NgModule({
  imports: [SharedModule,OperativocontablervRoutingModule,JasperModule],
  declarations: [OperativocontablervComponent]
})
export class OperativocontablervModule { }

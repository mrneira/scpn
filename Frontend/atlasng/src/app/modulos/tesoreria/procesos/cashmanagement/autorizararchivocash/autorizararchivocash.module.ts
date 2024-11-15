import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { AutorizarArchivoCashRoutingModule } from './autorizararchivocash.routing';
import { AutorizarArchivoCashComponent } from './componentes/autorizararchivocash.component';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, AutorizarArchivoCashRoutingModule, JasperModule,TooltipModule],
  declarations: [AutorizarArchivoCashComponent]
})
export class AutorizarArchivoCashModule { }

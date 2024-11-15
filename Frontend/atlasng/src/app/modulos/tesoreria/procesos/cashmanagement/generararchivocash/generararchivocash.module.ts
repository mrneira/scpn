import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { GenerarArchivoCashRoutingModule } from './generararchivocash.routing';
import { GenerarArchivoCashComponent } from './componentes/generararchivocash.component';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, GenerarArchivoCashRoutingModule, JasperModule,TooltipModule],
  declarations: [GenerarArchivoCashComponent]
})
export class GenerarArchivoCashModule { }

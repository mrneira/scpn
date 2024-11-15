import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { GenerarArchivoCobroRoutingModule } from './generararchivocobro.routing';
import { GenerarArchivoCobroComponent } from './componentes/generararchivocobro.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, GenerarArchivoCobroRoutingModule, JasperModule,TooltipModule],
  declarations: [GenerarArchivoCobroComponent]
})
export class GenerarArchivoCobroModule { }

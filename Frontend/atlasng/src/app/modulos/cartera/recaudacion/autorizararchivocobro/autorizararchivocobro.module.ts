import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AutorizarArchivoCobroRoutingModule } from './autorizararchivocobro.routing';
import { AutorizarArchivoCobroComponent } from './componentes/autorizararchivocobro.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { TooltipModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, AutorizarArchivoCobroRoutingModule, JasperModule,TooltipModule],
  declarations: [AutorizarArchivoCobroComponent]
})
export class AutorizarArchivoCobroModule { }

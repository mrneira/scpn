import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { PerfilesRoutingModule } from './perfiles.routing';
import { PerfilesComponent } from './componentes/perfiles.component';


@NgModule({
  imports: [SharedModule, PerfilesRoutingModule ],
  declarations: [PerfilesComponent]
})
export class PerfilesModule { }

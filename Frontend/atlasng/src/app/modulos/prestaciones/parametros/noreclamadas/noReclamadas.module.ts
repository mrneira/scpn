import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { NoReclamadasRoutingModule } from './noReclamadas.routing';
import { NoReclamadasComponent } from './componentes/noReclamadas.component';


@NgModule({
  imports: [SharedModule, NoReclamadasRoutingModule ],
  declarations: [NoReclamadasComponent]
})
export class NoReclamadasModule { }

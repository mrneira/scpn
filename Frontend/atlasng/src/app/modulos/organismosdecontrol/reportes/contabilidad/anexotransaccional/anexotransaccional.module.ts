import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { AnexoTransaccionalRoutingModule } from './anexotransaccional.routing';
import { AnexoTransaccionalComponent } from './componentes/anexotransaccional.component';

@NgModule({
  imports: [SharedModule, AnexoTransaccionalRoutingModule ],
  declarations: [AnexoTransaccionalComponent]
})
export class AnexoTransaccionalModule { }

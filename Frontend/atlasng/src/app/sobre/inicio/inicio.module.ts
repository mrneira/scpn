import { NgModule } from '@angular/core';
import { InicioRoutingModule } from './inicio.routing';

import { InicioComponent } from './componentes/inicio.component';


@NgModule({
  imports: [InicioRoutingModule ],
  declarations: [InicioComponent]
})
export class InicioModule { }

import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { Rendvarcaso01Component } from './componentes/rendvarcaso01.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';
import { Rendvarcaso01RoutingModule } from './rendvarcaso01.routing';

@NgModule({
  imports: [SharedModule, Rendvarcaso01RoutingModule, JasperModule, SpinnerModule ],
  declarations: [Rendvarcaso01Component]
})
export class Rendvarcaso01Module { }

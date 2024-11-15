import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ListadoProductosComponent } from './componentes/listadoProductos.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';
import { ListadoProductosRoutingModule } from './listadoProductos.routing';


@NgModule({
  imports: [SharedModule, ListadoProductosRoutingModule, JasperModule, SpinnerModule ],
  declarations: [ListadoProductosComponent]
})
export class ListadoProductosModule { }

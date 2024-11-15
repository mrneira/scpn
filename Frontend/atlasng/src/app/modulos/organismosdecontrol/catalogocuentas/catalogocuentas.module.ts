import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { CatalogocuentasRoutingModule } from './catalogocuentas.routing';
import { CatalogocuentasComponent } from './componentes/catalogocuentas.component';


@NgModule({
  imports: [SharedModule, CatalogocuentasRoutingModule ],
  declarations: [CatalogocuentasComponent]
})
export class CatalogocuentasModule { }

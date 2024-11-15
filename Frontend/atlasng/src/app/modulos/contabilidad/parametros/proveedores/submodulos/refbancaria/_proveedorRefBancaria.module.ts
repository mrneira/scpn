import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { ProveedorRefBancariaRoutingModule } from './_proveedorRefBancaria.routing';
import { ProveedorRefBancariaComponent } from './componentes/_proveedorRefBancaria.component';

@NgModule({
  imports: [SharedModule, ProveedorRefBancariaRoutingModule ],
  declarations: [ProveedorRefBancariaComponent],
  exports: [ProveedorRefBancariaComponent]
})
export class ProveedorRefBancariaModule { }

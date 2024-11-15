import { NgModule } from '@angular/core';
import { SharedModule } from 'app/util/shared/shared.module';
import { LovClienteRoutingModule } from './lov.cliente.routing';

import { LovClienteComponent } from './componentes/lov.cliente.component';
import { SelectButtonModule } from 'primeng/primeng';

@NgModule({
    imports: [SharedModule, LovClienteRoutingModule, SelectButtonModule],
    declarations: [LovClienteComponent],
    exports: [LovClienteComponent]
})
export class LovClienteModule { }


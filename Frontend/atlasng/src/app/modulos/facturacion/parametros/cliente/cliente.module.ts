import { NgModule } from '@angular/core';
import { SharedModule } from 'app/util/shared/shared.module';
import { ClienteRoutingModule } from './cliente.routing';

import { ClienteComponent } from './componentes/cliente.component';

@NgModule({
    imports: [SharedModule, ClienteRoutingModule],
    declarations: [ClienteComponent]
})
export class ClienteModule { }

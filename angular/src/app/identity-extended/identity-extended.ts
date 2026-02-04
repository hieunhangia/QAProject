// src/app/identity-extended/identity-extended.component.ts

import { LocalizationPipe } from '@abp/ng.core';
import { IdentityUserDto } from '@abp/ng.identity/proxy';
import { ModalCloseDirective, ModalComponent } from '@abp/ng.theme.shared';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-identity-extended',
  templateUrl: './identity-extended.html',
  imports: [
    CommonModule, 
    ModalComponent, 
    RouterOutlet, 
    LocalizationPipe, 
    ModalCloseDirective
  ],
  providers: [IdentityExtendedComponent]
})
export class IdentityExtendedComponent {
  isUserQuickViewVisible: boolean;

  user: IdentityUserDto;

  openUserQuickView(record: IdentityUserDto) {
    this.user = new Proxy(record, {
      get: (target, prop) => target[prop] || '—',
    });
    this.isUserQuickViewVisible = true;
  }
}

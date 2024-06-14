import { CommonModule } from '@angular/common';
import { Component, NgModule, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import notify from 'devextreme/ui/notify';
import { AuthService } from '../../services';
import { DxFormComponent } from 'devextreme-angular/ui/form';
import { DxTextBoxTypes } from 'devextreme-angular/ui/text-box';

type EditorOptions = DxTextBoxTypes.Properties;

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  @ViewChild(DxFormComponent, { static: false }) form!: DxFormComponent;

  loading = false;
  formData: any = {};

  passwordEditorOptions: EditorOptions = {
    mode: 'password',
    valueChangeEvent: 'keyup',
    buttons: [
      {
        name: 'password',
        location: 'after',
        options: {
          icon: 'eyeopen',
          stylingMode: 'text',
          onClick: () => this.changePasswordMode('password'),
        },
      },
    ],
  };

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit(e: Event) {
    e.preventDefault();
    const { email, password } = this.formData;
    this.loading = true;

    const result = await this.authService.logIn(email, password);
    if (!result.isOk) {
      this.loading = false;
      notify(result.message, 'error', 2000);
    }
  }
  changePasswordMode = (name: string) => {
    console.log('chegou aqui' + name);
    let editor = this.form.instance.getEditor(name);
    console.log(editor);
    editor?.option(
      'mode',
      editor.option('mode') === 'text' ? 'password' : 'text'
    );
  };

  onCreateAccountClick = () => {
    this.router.navigate(['/create-account']);
  };
}
@NgModule({
  imports: [CommonModule, RouterModule, DxFormModule, DxLoadIndicatorModule],
  declarations: [LoginFormComponent],
  exports: [LoginFormComponent],
})
export class LoginFormModule {}

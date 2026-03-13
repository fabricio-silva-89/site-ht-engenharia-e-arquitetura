export default function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
          Email
        </h3>
        <p className="text-secondary">contato@hitalothaina.com.br</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
          Redes Sociais
        </h3>
        <ul className="space-y-2 text-secondary">
          <li>Instagram: @hitalothaina.arq</li>
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
          Horário de Atendimento
        </h3>
        <p className="text-secondary">Segunda a Sexta: 9h - 18h</p>
        <p className="text-secondary">Sábado: 9h - 12h</p>
      </div>
    </div>
  );
}

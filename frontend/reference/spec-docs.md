Vôlei Preá
Alunos: Paulo Henrique de Souza Andrade, Yan Balbino Nogueira
Problema
O gerenciamento de diferentes aspectos de uma ou múltiplas partidas de vôlei e vôlei de areia durante uma sessão marcada em uma quadra/centro de treinamento. 
Público Alvo
Grupos de jogadores casuais de vôlei e vôlei de areia, profissionais de educação física ou empreendedores que organizam eventos esportivos locais, treinadores e professores de vôlei.
Justificativa
Ao longo de múltiplos eventos de reunião de amigos comuns aos membros da equipe, percebeu-se certa morosidade no processo de escolha e randomização de times, muitas vezes feita manualmente ou com a ajuda de algoritmos de IA alimentados durante o pré-partida, além de inconsistências na marcação dos pontos e momentos da partida.
Uso
A interface deve ser utilizada principalmente através de um aplicativo mobile, com acesso à internet, durante todo o desenrolar das múltiplas partidas.
Modelo de Processo de Design
O uso do Ciclo de Vida em Estrela, aliado com a Engenharia Baseada em Cenários (EBC) é ideal para o Vôlei Preá. Como o aplicativo será utilizado durante as partidas (ambiente dinâmico, sob sol/chuva/noite, com usuários em movimento), o design exige extrema adequação ao contexto físico e cognitivo. A EBC permite capturar essas nuances reais através de narrativas de uso, enquanto o modelo em Estrela, que possui a "Avaliação" no centro de todas as etapas, garante que as soluções sejam iteradas e testadas continuamente no ambiente real da quadra, sem a rigidez de um processo linear.
Aplicação das Etapas no Desenvolvimento
* 1. Análise de Requisitos (EBC - Cenários de Problema): Mapeamento das narrativas reais de frustração atual. Exemplo: O cenário do jogador que perde tempo sorteando times no papel ou lista no celular, ou do treinador que se confunde com a pontuação marcando mentalmente os pontos.
* 2. Design Conceitual e Físico (EBC - Cenários de Atividade, Informação e Interação): Criação de narrativas da solução. Define-se como o usuário vai interagir rapidamente com a interface (ex: "Laura, com uma mão, toca em um botão de alto contraste para registrar um ponto do time A enquanto acompanha a jogada").
* 3. Prototipação (Estrela): Construção de interfaces de baixa e alta fidelidade baseadas nos cenários de interação. O foco será em elementos de rápido alcance (Lei de Fitts) e layouts escuros/claros adaptáveis para uso outdoor.
* 4. Avaliação (Estrela): Etapa onipresente. Os protótipos são levados para a quadra de areia e testados com jogadores reais. Qualquer falha (ex: botões pequenos demais para clicar durante o jogo) força o retorno imediato à etapa de Design ou Prototipação, caracterizando a flexibilidade do modelo em Estrela.
* 5. Implementação (Estrela): Codificação do aplicativo mobile apenas após os ciclos de avaliação em quadra validarem a eficácia e eficiência dos protótipos. Mesmo após implementado, o app volta ao centro (Avaliação) para correções de usabilidade pós-lançamento.
Modelo de Coleta dos Dados
a. e b. Modelos de Coleta de Dados e Justificativas:


Questionários (Quantitativo):


Aplicação: Formulários digitais distribuídos em grupos de WhatsApp de jogadores e treinadores.


Justificativa: Permite alcançar um grande volume de usuários casuais rapidamente para mapear dados demográficos, sistemas operacionais predominantes e ranquear as maiores frustrações na organização atual.


Grupo Focal (Qualitativo):


Aplicação: Reunião estruturada com 5 a 8 profissionais de educação física e organizadores de torneios.


Justificativa: Extrair a fundo a lógica complexa que utilizam para balanceamento de times e regras de torneios, compreendendo as variáveis que a "randomização" do app precisará considerar.


Estudo de Campo (Observacional):


Aplicação: Observação in loco de partidas de vôlei de areia e quadra, anotando o comportamento de quem marca os pontos e organiza os times.


Justificativa: Método crítico para este projeto. Revela restrições ambientais reais que o usuário não verbaliza: reflexo do sol na tela, mãos sujas de areia ou suor, pressa para voltar à quadra e tempo de atenção reduzido.


c. Requisitos Funcionais e Não Funcionais (Foco em Usabilidade):


Requisitos Funcionais (RF):


RF01: O sistema deve permitir o cadastro de jogadores com níveis de habilidade.


RF02: O sistema deve gerar times aleatórios ou balanceados.


RF03: O sistema deve permitir a marcação (adição e remoção) de pontos para duas equipes em tempo real.


RF04: O sistema deve registrar o histórico e placar final das partidas.


Requisitos Não Funcionais (RNF - Usabilidade):


RNF01 (Visibilidade): A interface da partida deve possuir modo de alto contraste para leitura sob incidência direta de luz solar.


RNF02 (Prevenção e Recuperação de Erros): A ação de marcar ou remover um ponto deve ter feedback visual imediato e botão de "desfazer" de fácil acesso.


RNF03 (Eficiência): Os botões de pontuação devem ser os maiores elementos da tela (Lei de Fitts), exigindo no máximo 1 toque para computar um ponto, considerando usuários em movimento.


RNF04 (Resiliência): O aplicativo deve manter a marcação de pontos offline e sincronizar com o banco de dados assim que a internet for restabelecida.


d. Lista de Tarefas do Usuário
Consultar histórico de sessões


Consultar ranking de jogadores


Criar uma nova sessão/evento.


Adicionar jogadores à sessão.


Registrar novos jogadores


Solicitar a divisão de times (aleatória ou balanceada).


Iniciar o cronômetro/contador de pontos partida.


Incrementar ou decrementar pontuação das equipes.


Encerrar a partida e visualizar o resumo.


e. Fluxo de Tarefas (Exemplo: Marcação de Partida)


Abrir App > Selecionar "Novo Jogo" > Selecionar Jogadores Disponíveis (Checklist) > Tocar em "Gerar Times" > Revisar Times (opção de trocar jogadores de lado) > Tocar em "Iniciar Partida" > Tela de Placar Ativa (Toques em "+" ou "-" nas metades da tela) > Tocar em "Encerrar" > Salvar Histórico.


f. Personas


Persona 1: O Organizador Frequente (Profissional)


Nome: Andrier, 34 anos, Professor de Educação Física.


Perfil: Organiza rachas semanais de vôlei de areia com 20+ alunos.


Dores: Perde muito tempo dividindo os times no papel para garantir que fiquem equilibrados. Esquece o placar quando precisa apitar alguma infração.


Objetivo no App: Gerar times equilibrados com base no nível dos alunos em segundos e ter uma tela de placar que não desligue (Keep Awake) durante o jogo.


Persona 2: O Jogador Casual (Marcador de Pontos)


Nome: Laura, 22 anos, Estudante Universitária.


Perfil: Joga aos finais de semana com amigos. Todo mundo reveza quem fica de fora para marcar os pontos.


Dores: Não quer ficar de fora prestando atenção num app complexo. Tem dificuldade de enxergar a tela do celular por causa das luzes na quadra de areia.


Objetivo no App: Uma interface extremamente simples, com botões gigantes e cores fortes, para que ela possa dar o ponto com um toque rápido enquanto conversa com o pessoal de fora.


Abordagem Teórica
Para garantir que a interface seja intuitiva e exija o mínimo de atenção do usuário durante as partidas, o desenvolvimento será fundamentado nas seguintes abordagens teóricas:


Uso de Símbolos Conhecidos (Metáforas e Significantes):
A interface utilizará convenções visuais já estabelecidas no mundo dos esportes para reduzir a carga cognitiva. O layout do marcador simulará placares físicos tradicionais (números gigantes, fontes digitais, alto contraste). Ícones de uso universal, como um "apito" para iniciar a partida, um "troféu" para resultados e o botão clássico de "+" para pontuação, garantirão que o usuário reconheça as funções instantaneamente.


Uso de Metalinguagem:
O sistema "falará a língua" do usuário, adotando o jargão específico do domínio esportivo (ex: Set, Tie-break, Match Point, Rally). Além disso, a metalinguagem será usada na autoexplicação da interface: o aplicativo comunicará claramente seu próprio estado e regras de forma contextual (ex: um aviso discreto que diz "Sorteio balanceado pelos níveis dos jogadores" logo após a geração dos times).


Análise dos Golfos de Execução e Avaliação:
Esta abordagem é crucial devido às restrições do ambiente (luz, distração, pressa).


Golfo de Execução (Intenção > Ação): Será reduzido ao mínimo. Para o usuário realizar seu objetivo principal (marcar um ponto), ele não precisará navegar por menus. A ação exigirá apenas um toque amplo na área do time correspondente.


Golfo de Avaliação (Estado do Sistema > Percepção): Será minimizado através de feedback multissensorial. Como a luz do sol pode ofuscar a tela e o barulho da quadra abafa o som, ao marcar um ponto o aplicativo fornecerá um forte feedback visual (a cor do time pisca na tela inteira) e háptico (vibração do celular), confirmando o sucesso da ação sem que o usuário precise ler o número do placar.


Mapeamento do Processo (Mapeamento Natural):
A relação espacial dos controles na interface refletirá exatamente a disposição física da partida real. Se o "Time A" está jogando no lado esquerdo da quadra em relação ao observador, o controle de pontuação do "Time A" ficará no lado esquerdo da tela do celular. Esse mapeamento espacial natural elimina a necessidade de o usuário memorizar nomes de times, permitindo que a marcação de pontos seja feita de forma quase automática por reflexo geográfico.
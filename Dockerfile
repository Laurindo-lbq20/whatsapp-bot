# Etapa 1: Construção da imagem
FROM node:18 as builder
WORKDIR /app
COPY . .
RUN npm install --omit=dev

# Etapa 2: Executar o código
FROM node:18
WORKDIR /app
COPY --from=builder /app .
CMD ["node", "index.js"]

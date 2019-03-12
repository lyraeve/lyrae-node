FROM node:latest
ENV dir /lyrae
WORKDIR ${dir}
ADD . ${dir}
RUN yarn
RUN npm link @lyrae/lyrae
CMD lyrae

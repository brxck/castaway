# [Choice] Ruby version: 2, 2.7, 2.6, 2.5
ARG VARIANT=2
FROM mcr.microsoft.com/vscode/devcontainers/ruby:0-${VARIANT}

# Install Rails
RUN gem install rails webdrivers 

ARG NODE_VERSION="lts/*"
RUN su vscode -c "source /usr/local/share/nvm/nvm.sh && nvm install ${NODE_VERSION} 2>&1"

RUN mkdir -p "/home/vscode/.local/bin" && mkdir "/home/vscode/.config"
ENV PATH="/home/vscode/.local/bin:${PATH}"

# Dotfile management
RUN curl -fLo "/usr/local/bin/yadm" https://github.com/TheLocehiliosan/yadm/raw/master/yadm && chmod a+x "/usr/local/bin/yadm"

# Enable adding external reporitories
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
  && apt-get -y install software-properties-common

RUN curl -Lo bat.deb https://github.com/sharkdp/bat/releases/download/v0.18.0/bat_0.18.0_amd64.deb \
  && sudo dpkg -i bat.deb && rm -f bat.deb

RUN sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-key C99B11DEB97541F0
RUN sudo apt-add-repository https://cli.github.com/packages

RUN echo 'deb http://deb.debian.org/debian buster-backports main' >> /etc/apt/sources.list
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
  && apt-get -y install --no-install-recommends \
  # Devtools
  postgresql-client fzf nnn gh micro

RUN gem install solargraph

RUN sudo chown -R vscode:vscode "/home/vscode"
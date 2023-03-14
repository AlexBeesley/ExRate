FROM mcr.microsoft.com/dotnet/sdk:6.0 AS package
WORKDIR /app

COPY ExRate_API .
RUN dotnet publish -c Release -o out


FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3.9 \
    python3-pip \
    && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN pip install numpy pandas requests python-dotenv tensorflow scikit-learn keras matplotlib azure-core azure-common azure-identity azure-keyvault-secrets

COPY ./ExRate_Service ExRate_Service
COPY --from=package /app/out ExRate_API

ENV TF_CPP_MIN_LOG_LEVEL=1

ENTRYPOINT ["dotnet", "ExRate_API/ExRate_API.dll"]
EXPOSE 80
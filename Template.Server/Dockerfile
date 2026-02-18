FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy the common project and Template projects **keeping relative paths**
COPY Template/Template.Data ./Template/Template.Data
COPY Template/Template.Server ./Template/Template.Server

# Restore server project (will resolve references correctly)
RUN dotnet restore ./Template/Template.Server/Template.Server.csproj

# Publish
RUN dotnet publish ./Template/Template.Server/Template.Server.csproj \
    -c Release -o /app/publish

# Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .
EXPOSE 5249
ENTRYPOINT ["dotnet", "Template.Server.dll"]
